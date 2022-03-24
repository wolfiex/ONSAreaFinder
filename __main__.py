import geopandas as gpd
from p_tqdm import p_map
from tqdm import tqdm
import glob,js2py,warnings,json
# from io import BytesIO
from zipfile import ZipFile
from shapely.errors import ShapelyDeprecationWarning
warnings.filterwarnings("ignore", category=ShapelyDeprecationWarning) 


files = glob.glob('data/*.zip')

# Rtree using JS
size=10
context = js2py.EvalJs(enable_require=True)
context.eval("const RBush = require('rbush')")
tree = context.eval(f"new RBush({size})")


''' Functions''' 
def splice(area,name):
    ''' Get item dictionary and bounding box '''
    box = dict(zip(['minX','minY','maxX','maxY'],area[1].geometry.bounds))
    return dict(id = area[1].areacd,origin =name,  **box)

def sapling(f):
    ''' read each of the geojson files and process'''
    # load in memory
    zipfile = ZipFile(f,'r')
    z = zipfile.open( zipfile.filelist[0] )
    name = z.name.split('-')[1]
    # geo dataframe
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