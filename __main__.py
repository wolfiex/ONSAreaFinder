
import glob,js2py,warnings,json
from p_tqdm import p_map
import geopandas as gpd
from tqdm import tqdm
import gzip,re 
# from io import BytesIO
# from zipfile import ZipFile
from shapely.errors import ShapelyDeprecationWarning
warnings.filterwarnings("ignore", category=ShapelyDeprecationWarning) 


files = glob.glob('data/*.gz')

# Rtree using JS
size=10
context = js2py.EvalJs(enable_require=True)
context.eval("const RBush = require('rbush')")
tree = context.eval(f"new RBush({size})")



''' Functions''' 
def splice(area,name):
    ''' Get item dictionary and bounding box '''
    box = dict(zip(['minX','minY','maxX','maxY'],area[1].geometry.bounds))
    origin = re.search(r'\D+',name).group()
    year = re.search(r'\d+',name).group()

    return dict(id = area[1].areacd, origin=origin, year=year, **box)


def sapling(f):
    ''' read each of the geojson files and process'''
    # load in memory

    #  for Zip files
    # zipfile = ZipFile(f,'r')
    # z = zipfile.open( zipfile.filelist[0] )

    #  for gzipped files
    z = gzip.open(f,'rb')


    name = z.name.split('-')[1]
    gdf = gpd.read_file(z)

    return [splice(i,name) for i in gdf.iterrows()]



''' Code''' 

# for branch in tqdm(p_map(sapling,files)):
#     tree.load(branch)
leaf = []
for branch in p_map(sapling,files):
    leaf.extend(branch)

print('watering')
tree.load(leaf)

# save
json.dump(tree.toJSON().to_dict(),open('docs/tree.json','w'))
print('tree planted')